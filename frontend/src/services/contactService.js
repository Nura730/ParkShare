import api from "./api";

// Submit contact form
export const submitContact = async (name, email, subject, message) => {
  const response = await api.post("/contact/submit", {
    name,
    email,
    subject,
    message,
  });
  return response.data;
};

// Subscribe to newsletter
export const subscribeNewsletter = async (email) => {
  const response = await api.post("/contact/newsletter", {
    email,
  });
  return response.data;
};
