import { api } from "./api";

export async function uploadFile({
  file,
  name,
}: {
  file: File | null;
  name: string;
}): Promise<string | null> {
  if (!file) {
    alert("Por favor, selecione um arquivo antes de fazer o upload.");
    return null;
  }

  const nameFile = `${name}.${file.type.split("/")[1]}`;
  const fileRenamed = new File([file], nameFile, { type: file.type });

  const formData = new FormData();
  formData.append("file", fileRenamed);

  try {
    const response = await api.post("/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const url = response.data.url;

    // setUploadedUrl(url);
    return url;
  } catch (err: any) {
    console.log("Erro no upload:", err.response?.data || err.message);
    return null;
  }
}
