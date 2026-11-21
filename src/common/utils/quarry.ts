const devUrl: string = 'http://localhost:8080/api/v1';
const prodUrl: string = 'https://assetflow-backend.vercel.app/api/v1';
export const imageUrl: string =
  'https://pub-a9ad64933de747bdae3e20f48daca2ee.r2.dev/';

const isDev: boolean = import.meta.env.MODE === 'development';

export const baseQuery = isDev ? devUrl : prodUrl;
