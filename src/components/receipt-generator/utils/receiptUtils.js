import html2canvas from 'html2canvas'

export const downloadReceipt = async (receiptRef, getPeriodLabel) => {
  if (!receiptRef.current) return
  try {
    const canvas = await html2canvas(receiptRef.current, {
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
    })
    const link = document.createElement('a')
    link.download = `reading-receipt-${getPeriodLabel().replace(/\s/g, '-').toLowerCase()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('Error generating image:', error)
    alert('Error generating image. Please try taking a screenshot instead.')
  }
}

export const shareReceipt = async (receiptRef, getPeriodLabel, downloadReceiptFallback) => {
  if (!receiptRef.current) return downloadReceiptFallback()
  try {
    const canvas = await html2canvas(receiptRef.current, {
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
    })
    const dataUrl = canvas.toDataURL('image/png')
    if (navigator.canShare && navigator.canShare()) {
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'reading-receipt.png', { type: 'image/png' })
      await navigator.share({
        files: [file],
        title: 'Reading Receipt',
        text: 'Check out my reading receipt',
      })
    } else {
      const link = document.createElement('a')
      link.download = `reading-receipt-${getPeriodLabel().replace(/\s/g, '-').toLowerCase()}.png`
      link.href = dataUrl
      link.click()
    }
  } catch (err) {
    console.error('Share failed, falling back to download', err)
    downloadReceiptFallback()
  }
}
