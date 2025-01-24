"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadImageProps = {
  className?: string;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  uploadedUrl: string | null;
  setUploadedUrl: Dispatch<SetStateAction<string | null>>;
};

export default function UploadImage({
  file,
  setFile,
  uploadedUrl,
  setUploadedUrl,
  className = "",
}: UploadImageProps) {
  // const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);

        // Usando FileReader para gerar a URL de preview
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string); // Atualiza a URL de preview
        };
        reader.readAsDataURL(selectedFile); // Converte o arquivo para Data URL
      }
    } catch (error) {
      console.log("🚀 ~ handleFileChange ~ error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Input escondido */}
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Label como botão estilizado */}
      <label
        htmlFor="file-upload"
        className={cn(
          "w-32 h-32 bg-muted/60 rounded-full",
          { "bg-inherit": previewUrl || uploadedUrl },
          { "hover:bg-muted": !previewUrl && !uploadedUrl }
        )}
      >
        <Button
          type="button"
          variant="link"
          asChild
          className={cn("cursor-pointer", className)}
        >
          {/* Preview da imagem */}
          <div className={cn("w-full h-full")}>
            {previewUrl || uploadedUrl ? (
              <Image
                src={previewUrl ? previewUrl : (uploadedUrl as string)}
                alt="Pré-visualização"
                className="w-full h-full object-contain"
                width={250}
                height={250}
              />
            ) : (
              <Upload size={20} />
            )}
          </div>
        </Button>
      </label>

      <div className="flex items-center">
        <label htmlFor="file-upload">
          <Button
            type="button"
            variant="link"
            asChild
            className={cn("cursor-pointer", className)}
          >
            {/* Preview da imagem */}
            <div className="">
              <span className="text-xs ">
                {previewUrl || uploadedUrl
                  ? "Trocar Imagem"
                  : "Escolher Imagem"}
              </span>
            </div>
          </Button>
        </label>

        {(previewUrl || uploadedUrl) && (
          <button
            type="button"
            onClick={(e) => {
              setFile(null);
              setPreviewUrl(null);
              setUploadedUrl(null);
            }}
            className="hover:text-destructive"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
