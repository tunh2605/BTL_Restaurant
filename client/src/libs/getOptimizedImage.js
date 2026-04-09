const getOptimizedImage = (url, width = 800) => {
  if (!url) return "";
  return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
};

export default getOptimizedImage;
