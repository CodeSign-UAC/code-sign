import { useState } from 'react'
import { FileIcon, UploadCloudIcon } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { Link } from '@tanstack/react-router'

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
      .from('public_resources')
      .upload(filePath, file)

    if (error) {
      console.error('Error al subir archivo:', error.message)
      alert('Error al subir el archivo')
      setUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('public_resources').getPublicUrl(filePath)

    setPublicUrl(publicUrl)

    if (onChange) {
      onChange(publicUrl)
    }

    setUploading(false)
  }

  return (
    <div className="max-w-md bg-white rounded-xl text-center">
      {!currentPublicUrl ? (
        <label className="cursor-pointer flex flex-col h-32 active:scale-95 justify-center items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition">
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
      ) : (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-blue-900">
            Archivo Subido Exitosamente
          </p>
          <div className="bg-blue-50 flex flex-col p-4 rounded-xl text-blue-600 justify-center items-center py-8">
            <FileIcon />
            <Link target="_blank" to={currentPublicUrl}>
              {fileName}
            </Link>
          </div>
        </div>
      )}

      {fileName && !currentPublicUrl && (
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
