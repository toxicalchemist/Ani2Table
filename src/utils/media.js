export function getMediaUrl(path) {
  const placeholder = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800';
  if (!path) return placeholder;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const api = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const origin = api.replace(/\/api\/?$/, '') || 'http://localhost:5000';
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
}
