const BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const fetchTournaments = async () => {
    const response = await fetch(`${BASE_URL}/tournaments`);
    return await response.json();
};
