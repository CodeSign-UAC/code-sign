import { useState } from 'react'
import { UploadCloudIcon } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { Value } from '@radix-ui/react-select'

interface Props {
  name: string
  value?: string
  onChange?: (newUrl: string) => void
}

export function SingleFileUpload({ name, value, onChange }: Props) {
  const [fileName, setFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [currentPublicUrl, setPublicUrl] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]

    setUploading(true)
    setFileName(file.name)

    const filePath = `uploads/${Date.now()}_${file.name}`

    const { error } = await supabase.storage
      .from('resources')
      .upload(filePath, file)

    if (error) {
      console.error('Error al subir archivo:', error.message)
      alert('Error al subir el archivo')
      setUploading(false)
      return
    }

      const {
        data: { publicUrl },
      } = supabase.storage.from('tu-bucket').getPublicUrl(filePath)

      setPublicUrl(publicUrl) 

      if (onChange) {
        onChange(publicUrl)
      }


    setUploading(false)
  }

  return (
    <div className="max-w-md bg-white rounded-xl shadow-md text-center">
      <label className="cursor-pointer flex flex-col h-32 justify-center items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 transition">
        <input
          type="file"
          name={name}
          onChange={handleFileChange}
          className="hidden"
        />
        <UploadCloudIcon />
        <span className="text-sm text-gray-600">
          {uploading ? 'Subiendo...' : 'Haz clic o arrastra un archivo aquí'}
        </span>
      </label>

      {fileName && (
        <div className="mt-4 text-sm text-gray-700">
          Archivo seleccionado: <strong>{fileName}</strong>
        </div>
      )}

      {value && (
        <>
          <p className="mt-4 text-green-600">¡Archivo subido con éxito!</p>
          <input type="hidden" name="file_url" value={value} />
          <p className="text-sm break-all text-gray-600 mt-1">
            URL:{' '}
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600"
            >
              {value}
            </a>
          </p>
        </>
      )}
    </div>
  )
}
