export interface IImageDAO {
  uploadProfileImage(
    alias: string,
    base64Image: string,
    fileExtension: string
  ): Promise<string>;
}
