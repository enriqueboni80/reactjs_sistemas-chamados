import { useState, useContext } from "react";
import { AuthContext } from "../../context/auth";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiSettings, FiUpload } from "react-icons/fi";
import avatar from "../../assets/avatar.png";
import firebase from "../../services/firebaseConnection";
import "./profile.css";

function Profile() {
  const { user, signOut, setUser, storageUser } = useContext(AuthContext);

  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);

  const handleFile = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        alert("envie uma imagem do tipo png ou jpeg");
        setImageAvatar(null);
        return null;
      }
    }

    //console.log(e.target.files[0]);
  };

  const handleUpload = async () => {
    const currentUid = user.uid;
    const uploadTask = await firebase
      .storage()
      .ref(`images/${currentUid}/${imageAvatar.name}`)
      .put(imageAvatar)
      .then(async () => {
        console.log("FOTO ENVIADO COM SUCESSO");

        await firebase
          .storage()
          .ref(`images/${currentUid}`)
          .child(imageAvatar.name)
          .getDownloadURL()
          .then(async (url) => {
            let urlFoto = url;
            await firebase
              .firestore()
              .collection("users")
              .doc(user.uid)
              .update({
                avatarUrl: urlFoto,
                nome: nome,
              })
              .then(() => {
                let data = {
                  ...user,
                  avatarUrl: urlFoto,
                  nome: nome,
                };
                setUser(data);
                storageUser(data);
              });
          });
      });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (imageAvatar === null && nome !== "") {
      await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .update({ nome: nome })
        .then(() => {
          let data = {
            ...user,
            nome: nome,
          };
          setUser(data);
          storageUser(data);
        })
        .catch((erro) => console.log(erro));
    } else if (nome !== "" && imageAvatar !== null) {
      handleUpload();
    }
  };

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Meu Perfil">
          <FiSettings size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={(e) => handleSave(e)}>
            <label className="label-avatar">
              <span>
                <FiUpload color="FFF" size={25} />
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e)}
              />
              <br />
              {avatarUrl === null ? (
                <img
                  src={avatar}
                  width="250"
                  height="250"
                  alt="Foto de perfil do usuario"
                />
              ) : (
                <img
                  src={avatarUrl}
                  width="250"
                  height="250"
                  alt="Foto de perfil do usuario"
                />
              )}
            </label>
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            ></input>
            <label>Email</label>
            <input type="text" value={email} disabled={true}></input>
            <button type="Submit">Salvar</button>
          </form>
        </div>

        <div className="container">
          <button className="logout-btn" onClick={signOut}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
