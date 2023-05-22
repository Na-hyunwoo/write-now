export const getTitle = (path: string) => {
  if (path.includes("admission-letter")) {
    return "진학 자소서"
  };

  if (path.includes("cover-letter")) {
    return "취업 자소서"
  };
};