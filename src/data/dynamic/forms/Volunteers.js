import { MAJORS, GRADES, GENDERS, SHIRTS } from "./Information";

export const FIELDS = {
  description: {
    input: "description",
    width: 12,
    texts: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    ],
  },
  name: {
    input: "input",
    name: "name",
    type: "text",
    title: "Name",
    maxLength: 50,
    width: 12,
    editable: false,
    required: true,
  },
  email: {
    input: "input",
    name: "email",
    type: "email",
    title: "Email Address",
    maxLength: 50,
    width: 12,
    editable: false,
    required: true,
  },
  phone: {
    input: "input",
    name: "phone",
    type: "phone",
    title: "Phone Number",
    placeholder: "123 456 7890",
    maxLength: 50,
    width: 12,
    required: true,
  },

  discord: {
    input: "input",
    name: "discord",
    type: "discord",
    title: "Discord Username",
    placeholder: "ie. john123",
    maxLength: 30,
    width: 12,
    required: true,
  },
  major: {
    input: "select",
    title: "Major",
    options: MAJORS,
    field: "major",
    placeholder: "ie. Computer Science",
    width: 12,
    required: true,
  },
  grade: {
    input: "select",
    title: "Grade",
    options: GRADES,
    field: "grade",
    placeholder: "ie. Undergraduate",
    width: 12,
    required: true,
  },
  availability: {
    input: "checkboxes",
    width: 12,
    field: "availability",
    text: "Availability",
    required: true,
    options: [
      "Friday Morning",
      "Saturday Morning",
      "Sunday Morning",
      "Friday Afternoon",
      "Saturday Afternoon",
      "Sunday Afternoon",
      "Friday Evening",
      "Saturday Evening",
      "Sunday Evening",
      "Friday Night",
      "Saturday Night",
      "Sunday Night",
    ],
  },
  gender: {
    input: "radio",
    text: "Gender",
    options: GENDERS,
    field: "gender",
    width: 12,
    required: true,
  },
  shirt: {
    input: "radio",
    text: "Shirt Size",
    options: SHIRTS,
    field: "shirt",
    width: 12,
    required: true,
  },
  requirements: {
    text: "Terms and Conditions",
    input: "checkboxes",
    width: 12,
    field: "requirements",
    required: true,
    options: [
      "I agree to photograph. Thank you",
      "I understand that I will attend the event in person.",
    ],
  },
};
