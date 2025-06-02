export default async function compressImage(
  image: File,
  props?: { quality?: number; maxWidth?: number }
): Promise<File> {
  const quality = props?.quality ?? 0.7;
  const maxWidth = props?.maxWidth ?? 1024;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");

        let { width, height } = img;
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context not available"));

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], image.name, {
                type: image.type,
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Compression failed"));
            }
          },
          image.type,
          quality
        );
      };

      img.onerror = reject;
      img.src = event.target?.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(image);
  });
}
