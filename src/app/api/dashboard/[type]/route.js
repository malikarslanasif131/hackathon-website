import { NextResponse } from "next/server";
import { db } from "../../../../utils/firebase";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  deleteField,
  Timestamp,
  writeBatch,
  addDoc,
} from "firebase/firestore";
import { authenticate } from "@/utils/auth";
import { AUTH } from "@/data/dynamic/admin/Admins";
import SG from "@/utils/sendgrid";
import { ATTRIBUTES } from "@/data/dynamic/admin/Attributes";

export async function POST(req, { params }) {
  const res = NextResponse;
  const { auth, message, user } = await authenticate(AUTH.POST);

  if (auth !== 200) {
    return res.json(
      { message: `Authentication Error: ${message}` },
      { status: auth }
    );
  }
  const data = await req.json();
  const element = {};
  ATTRIBUTES[params.type].forEach((attribute) => {
    element[attribute] = data[attribute];
  });

  try {
    switch (params.type) {
      case "admins":
      case "committees":
      case "judges":
      case "mentors":
      case "volunteers":
      case "participants":
      case "interests":
      case "sponsors":
        await updateDoc(doc(db, "users", user.id), {
          ...element,
          timestamp: Timestamp.now(),
          [`roles.${params.type}`]: 0,
        });
      case "feedback":
        await addDoc(collection(db, "feedback"), {
          ...element,
          timestamp: Timestamp.now(),
          rating: parseInt(data.rating),
          status: 0,
        });
      case "teams":
        const team = {
          links: {
            github: "",
            devpost: "",
            figma: "",
          },
          members: [{ discord: user.discord, name: user.name, uid: user.id }],
          status: 0,
        };
        const docRef = await addDoc(collection(db, "teams"), team);
        await updateDoc(doc(db, "users", user.id), {
          team: docRef.id,
        });
    }

    SG.send({
      to: user.email,
      template_id: process.env.SENDGRID_CONFIRMATION_TEMPLATE,
      dynamic_template_data: {
        name: user.name,
        position: params.type.slice(0, -1).toUpperCase(),
      },
    });

    return res.json({ message: "OK" }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const res = NextResponse;
  const { auth, message } = await authenticate({
    admins: [1],
  });

  if (auth !== 200) {
    return res.json(
      { message: `Authentication Error: ${message}` },
      { status: auth }
    );
  }

  const output = [];
  try {
    let snapshot;
    switch (params.type) {
      case "admins":
      case "committees":
      case "judges":
      case "mentors":
      case "volunteers":
      case "participants":
      case "interests":
      case "sponsors":
        snapshot = await getDocs(
          query(
            collection(db, "users"),
            where(`roles.${params.type}`, "in", [-1, 0, 1])
          )
        );
        snapshot.forEach((doc) => {
          const data = doc.data();
          const element = {};
          ATTRIBUTES[params.type].forEach((attribute) => {
            element[attribute] = data[attribute];
          });
          output.push({
            ...element,
            uid: doc.id,
            timestamp: data.timestamp,
            status: data.roles[params.type],
            selected: false,
            hidden: false,
          });
        });
        break;
      case "feedback":
        snapshot = await getDocs(collection(db, "feedback"));
        snapshot.forEach((doc) => {
          const data = doc.data();
          const element = {};
          ATTRIBUTES[params.type].forEach((attribute) => {
            element[attribute] = data[attribute];
          });
          output.push({
            ...element,
            uid: doc.id,
            timestamp: data.timestamp,
            selected: false,
            hidden: false,
          });
        });
        break;
    }
    const sorted = output.sort((a, b) =>
      a.timestamp.seconds < b.timestamp.seconds ? 1 : -1
    );
    return res.json({ message: "OK", items: sorted }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const res = NextResponse;
  const { objects, status } = await req.json();
  const { auth, message } = await authenticate(AUTH.PUT);

  if (auth !== 200) {
    return res.json(
      { message: `Authentication Error: ${message}` },
      { status: auth }
    );
  }
  try {
    const batch = writeBatch(db);
    switch (params.type) {
      case "admins":
      case "committees":
      case "judges":
      case "mentors":
      case "volunteers":
      case "participants":
      case "interests":
      case "sponsors":
        objects.forEach(async (object) => {
          await batch.update(doc(db, "users", object.uid), {
            [`roles.${params.type}`]: status,
          });
          SG.send({
            to: object.email,
            template_id:
              status === 1
                ? process.env.SENDGRID_ACCEPTANCE_TEMPLATE
                : process.env.SENDGRID_REJECTION_TEMPLATE,
            dynamic_template_data: {
              name: object.name,
              position: params.type.slice(0, -1).toUpperCase(),
            },
          });
        });
      case "feedback":
        objects.forEach(async (object) => {
          await batch.update(doc(db, "feedback", object.uid), {
            status: status,
          });
        });
        break;
      case "teams":
        objects.forEach(async (object) => {
          await batch.update(doc(db, "teams", object.uid), {
            status: status,
          });
        });
        break;
    }
    await batch.commit();
    return res.json({ message: "OK" }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const res = NextResponse;
  const { auth, message } = await authenticate(AUTH.DELETE);
  const objects = req.nextUrl.searchParams.get("remove").split(",");

  if (auth !== 200) {
    return res.json(
      { message: `Authentication Error: ${message}` },
      { status: auth }
    );
  }
  try {
    const batch = writeBatch(db);
    switch (params.type) {
      case "admins":
      case "committees":
      case "judges":
      case "mentors":
      case "volunteers":
      case "participants":
      case "interests":
      case "sponsors":
        objects.forEach(async (object) => {
          await batch.update(doc(db, "users", object), {
            [`roles.${params.type}`]: deleteField(),
          });
        });
      case "feedback":
        objects.forEach(async (object) => {
          await batch.delete(doc(db, "feedback", object));
        });
        break;
      case "teams":
        objects.forEach(async (object) => {
          const members = db.collection("users").where("team", "==", object);
          members.get().then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              batch.update(doc(db, "users", object), {
                team: deleteField(),
              });
            });
          });
          await batch.delete(doc(db, "teams", object));
        });
    }
    await batch.commit();
    return res.json({ message: "OK" }, { status: 200 });
  } catch (err) {
    return res.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 }
    );
  }
}
