    import { useState } from 'react'
    import { Button } from '@/components/ui/button'
    import { supabase } from '@/lib/supabaseClient'

    interface CompleteResourceButtonProps {
    userId: string | number
    resourceId: number
    onSuccess?: () => void
    }

    export default function CompleteResourceButton({
    userId,
    resourceId,
    onSuccess,
    }: CompleteResourceButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleComplete = async () => {
        setIsLoading(true)
        setError(null)

        try {
        const { data, error } = await supabase
            .from('trn_user_resource')
            .update({ has_completed: true })
            .eq('id_user', userId)
            .eq('id_resource', resourceId)

        if (error) throw error

        if (onSuccess) onSuccess()
        } catch (err: any) {
        console.error('Error marking resource as completed:', err)
        setError(err.message || 'Error al completar recurso')
        } finally {
        setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-2">
        <Button onClick={handleComplete} disabled={isLoading} variant="default">
            {isLoading ? 'Marcando...' : 'Marcar como completado'}
        </Button>
        {error && <span className="text-red-600 text-sm">{error}</span>}
        </div>
    )
    }
