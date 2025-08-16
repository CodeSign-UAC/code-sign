import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'

interface TrackResourceDialogProps {
    userIdNumber: number; 
    resourceId: number;
    onSuccess?: () => void;
}

export default function TrackResourceDialog({
    userIdNumber,
    resourceId,
    onSuccess,
}: TrackResourceDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleJoinTracking = async () => {
        if (!userIdNumber) {
        alert('No se pudo identificar al usuario.')
        return
        }

        setIsLoading(true)

        try {
        const { data, error } = await supabase
            .from('trn_user_resource')
            .insert({
            id_user: userIdNumber,        
            id_resource: resourceId
            })

        if (error) {
            console.error('Error al unirse al seguimiento:', error)
            alert('Error al unirse al seguimiento: ' + error.message)
        } else {
            if (onSuccess) onSuccess()
        }
        } catch (err: any) {
        console.error('Error inesperado:', err)
        alert('Error inesperado: ' + err.message)
        } finally {
        setIsLoading(false)
        }
    }

    return (
        <Button
        onClick={handleJoinTracking}
        disabled={isLoading || !userIdNumber}
        variant="default"
        >
        {isLoading ? 'Uniéndose...' : 'Unirse al seguimiento'}
        </Button>
    )
    }
