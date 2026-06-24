import axios from 'axios';

const BACKEND_URL = 'https://roadguardianaibackend.onrender.com';

/**

* Sends image to Flask YOLO backend.
* No mock data.
* No fallback detections.
* Only real model predictions.
  */

export const predictRoadDamage = async (imageFile) => {
const formData = new FormData();
formData.append('image', imageFile);

try {
const response = await axios.post(
`${BACKEND_URL}/predict`,
formData,
{
headers: {
'Content-Type': 'multipart/form-data',
},
timeout: 30000,
}
);
console.log("RESPONSE =", response.data);
return {
  success: true,
  data: response.data,
  isFallback: false,
};

} catch (error) {
console.error('Flask backend error:', error);

return {
  success: false,
  data: [],
  isFallback: false,
  error: error.message,
};
}
};
