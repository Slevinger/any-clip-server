const firebaseAdmin = require("firebase-admin");
const isEmpty = require("lodash").isEmpty;

const serviceAccount = {
  type: "service_account",
  project_id: "wizu-8c986",
  private_key_id: "0ae85281048eb3ee95ebb81cf92e4a5a63b7c808",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDqFsLF8s2Ev0sd\n2fcREMIsRhFt4iW6tUGvm4gqX30mGwHAJDgsY1uIB+Xcu1Y38yGrMGpYtxx7aV+J\nZw84ddDbHkQX/rTYzFBjIbDxW9pZWr2UIWtYIZkLlENZEMGQLHmDSNkq7VrVIvnN\nHsLbnM3C2XPnOZpTTaEpWFKs7vB7/flpw2wfg6qT7Q8PPQC8Wbt8SSFHgdmb8o9E\nk0i/02V+Vsxcatga/JMjph4MaEpDQUfIw1/JnmA3u5ue2vrrGo42rwuNyGHo/ynJ\n9oItm/45xZhXEwfuSaADgtOck2ebcrcQTtXzO6XcO7pJFZUDZhD+pvl/Mns1PyMQ\ndVeGgA1PAgMBAAECggEABQLluo0fHzdlKUdwRZpBPedmGh8cRan5tQO0X4vZxwYO\n/IkJ9tFNtVTN8/LCvsHit6J6tFl/L5kq5WsiZUgIZ5h3Rrg6MOX21phzDEe2HfGW\nW2R3wtQ9TYUoB/EW47pAA7J8i7G3Hxb3mA+PhloOAZzcIVgXWK8xwwvUAUXAOjdE\nMin/SafPYyl/bzWem7+CL8ElHG/8TlPXj+Ply/pk19eibD31ImIUf2ZEejI5kb42\n3D5IjnroaFrQxP2p2LhUimFzBpsLX0O3AowFOA4zKQtsN/oOyp8KY6mNY5057gGJ\nt0HE702G3DgYVOSjR962uxvXLYe/49o/7vFwfwl+yQKBgQD8WnG02YKxxuimobCf\nZLvDUvuQ4XK7e83Zfv9a7mNiTPzk2GLtTpiAdI2nsMk4KWsb9epSo3VpGuIB8IDY\nKn8rXPAtc150gO7AYYv5qCpMEIBlXftYqCYReW+3YmCqCyNjntYSllbipVPMSxjQ\nmICkApPsBct6nYJYmLy5fLzAHQKBgQDteL/X0Ne6CZ3vgZwbBpSs7/K4b1jhfVtJ\nnkOEvYORp932IrUCRj06vTA0leHlZw8sSZtqEUYuK2gVba4ZjyBbPV+6gyLzvIex\nzJWjVHd+1/drpaexVvTX8eiWFZe6PKewuIuFrRgwMXCtxCaz5ygZQ9ygG/4wp2dv\nkHfxtAFfWwKBgE7+dOeayvmhfURkCujqXIhZGpyQphygNaDmy0KIqx2jYeq0/cqx\nNrXHRmx+v45QENJQ2YgC2QcMvkDDK2H/c418a0ae/atUjOg14N5G0O68n6Sblcl7\n4WbI77qlFgNEt1BA8VwiKZKLFD84Js1tX593mxxf+AEq+xmGvlUGAgPVAoGBAMIc\nC6Sbf1sAdWrLJREqRek+kcaUrbBTyYTZqxMb3in3b4W8RP1A8NfMwVSal3Xu0gY/\nfJws1pLyxDeP2dnmlmo+Nru8aZuWJcz+D+rcJnk2i3YgiHx7OdQyVw4nREjlP6VC\nlDmGjdkG8LX5OjGf57UPNY5ik1qt2+zjyEd3/g81AoGBAPdwQLv6FGLgcWr7J6wQ\nNjW2nQ+OWpGnTEDpGOQuKNtDU3Fh0zIE2DZMyGL6rJKKLCR9nv82BoY+vhNdZKgK\nAZrGxRCjSkE04sGaiAm6kO5Yz+hS7o/Ogu3wx1X5FirbwaeHXuXbrKDiU8L5I+On\n0suN93k0e76DDxTRZtCr/jNt\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-lzm7d@wizu-8c986.iam.gserviceaccount.com",
  client_id: "101158057514250772650",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-lzm7d%40wizu-8c986.iam.gserviceaccount.com"
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: "gs://wizu-8c986.appspot.com/",
  databaseURL: "https://wizu-8c986.firebaseio.com"
});

const bucket = firebaseAdmin.storage().bucket("gs://wizu-8c986.appspot.com/");

const uploadImageToStorage = (file, dest, name) => {
  return new Promise(async (resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    const desc = name.split("_")[0];
    const files = await bucket.getFiles({ prefix: `${dest}/${desc}` });
    if (!isEmpty(files[0])) {
      await files[0].forEach(file => {
        file.delete();
      });
    }
    const parts = file.originalname.split(".");
    const newFileName = (name
      ? `${name}.${parts[parts.length - 1]}`
      : `${new Date().getTime()}-${file.originalname}`
    )
      .split("/")
      .join("%2F");

    let fileUpload = bucket.file(`${dest}/${newFileName}`);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        size: file.size
      }
    });

    blobStream.on("error", error => {
      reject("Something is wrong! Unable to upload at the moment.");
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURI(fileUpload.name)
        .split("/")
        .join("%2F")}`;

      resolve(publicUrl);

      // The public URL can be used to directly access the file via HTTP.
    });

    blobStream.end(file.buffer);
  });
};

const addUserPhoto = (username, file) => {
  return uploadImageToStorage(file, `users/${username}`, `avatar__${username}`);
};

module.exports = {
  // bucket,
  // firebaseAdmin,
  addUserPhoto
};
