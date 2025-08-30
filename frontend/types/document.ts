export type SignedDoc = {
  documentId: string
  documentName: string
  signedAt: string
  signerCpf: string
  signatureHash: string
}

export type PublicDoc = {
  id: string
  name: string
}
