import { API_URL } from "../config/api";

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
        return `${API_URL}${image}`;
    }

    return image;
};