export const getProductImageUrl = (image) => {
    if (!image) {
        return "";
    }

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }

    if (image.startsWith("/uploads/")) {
        return `http://localhost:8080${image}`;
    }

    return image;
};