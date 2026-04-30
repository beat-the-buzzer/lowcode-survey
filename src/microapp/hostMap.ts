const prod_map = {
  yx: location.origin,
};

export default function hostMap(key = "yx") {
  return import.meta.env.MODE === "production" ? prod_map[key] : "*";
}
