import type { VariantType } from 'notistack';
import { useSnackbar } from 'notistack';
import React, { useCallback } from 'react';

export function useNotify() {
    const { enqueueSnackbar } = useSnackbar();

    return useCallback(
        (variant: VariantType, message: string, signature?: string) => {
            enqueueSnackbar({ variant });
        },
        [enqueueSnackbar]
    );
}
