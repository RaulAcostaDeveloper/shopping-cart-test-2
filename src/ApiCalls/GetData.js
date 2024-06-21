export const getData = async(url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(url + response.status);
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('getData: ' + error)
    }
}

export const getIMGURL = async(url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(url + response.status);
        } else {
            return response.url;
        }
    } catch (error) {
        console.error('getData: ' + error)
    }
}