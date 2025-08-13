import { Google } from 'arctic';
import { PRIVATE_GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

export default new Google(PUBLIC_GOOGLE_CLIENT_ID, PRIVATE_GOOGLE_CLIENT_SECRET, "http://localhost:5173/login/google/callback");
