import { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../context/auth";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { toast } from "react-toastify";
import { FiPlusCircle } from "react-icons/fi";

import "./new.css";

function New() {
  const { id } = useParams("id");
  const history = useHistory();
  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomersSelected] = useState(0);
  const [assunto, setAssunto] = useState("Suporte");
  const [status, setStatus] = useState("Aberto");
  const [complemento, setComplemento] = useState("");
  const [idCustomer, setIdCustomer] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadCustomers = async () => {
      await firebase
        .firestore()
        .collection("customers")
        .get()
        .then((snapshot) => {
          let lista = [];
          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia,
            });
          });
          if (lista.length === 0) {
            console.log("NENHUMA EMPRESA ENCONTRADA");
            setCustomers([{ id: "1", nomeFantasia: "FREELA" }]);
            setLoadCustomers(false);
            return;
          }
          setCustomers(lista);
          setLoadCustomers(false);

          if (id) {
            loadId(lista);
          }
        })
        .catch((error) => {
          console.log("DEU ALGUM ERRO!", error);
          setLoadCustomers(false);
          setCustomers([{ id: "1", nomeFantasia: "" }]);
        });
    };
    loadCustomers();
  }, [id]);

  const loadId = async (lista) => {
    await firebase
      .firestore()
      .collection("chamados")
      .doc(id)
      .get()
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto);
        setStatus(snapshot.data().status);
        setComplemento(snapshot.data().complemento);
        let index = lista.findIndex(
          (item) => item.id === snapshot.data().clienteId
        );
        setCustomersSelected(index);
        setIdCustomer(true);
      })
      .catch((erro) => {
        console.log("ERRO NO ID PASSADO", erro);
        setIdCustomer(false);
      });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (idCustomer) {
      await firebase
        .firestore()
        .collection("chamados")
        .doc(id)
        .update({
          cliente: customers[customerSelected].nomeFantasia,
          clienteId: customers[customerSelected].id,
          assunto: assunto,
          status: status,
          complemento: complemento,
          userId: user.uid,
        })
        .then(() => {
          toast.success("Chamado Editado com sucesso");
          setCustomersSelected(0);
          setComplemento("");
          history.push("/dashboard");
        })
        .catch((erro) => {
          toast.error("Ops erro ao registrar, tente mais tarde");
          console.log(erro);
        });
      return;
    }

    await firebase
      .firestore()
      .collection("chamados")
      .add({
        created: new Date(),
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid,
      })
      .then(() => {
        toast.success("Chamado registrado com sucesso");
        setComplemento("");
        setCustomersSelected(0);
      })
      .catch((erro) => {
        toast.error("Ops, erro ao registrar, tente mais tarde");
        console.log(erro);
      });
  };

  const handleChangeSelect = (e) => {
    setAssunto(e.target.value);
  };

  const handleOptionChange = (e) => {
    setStatus(e.target.value);
  };

  const handleChangeCustomers = (e) => {
    setCustomersSelected(e.target.value);
  };

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Novo Chamado">
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Cliente</label>

            {loadCustomers ? (
              <input type="text" disabled={true} value="carregando cliente" />
            ) : (
              <select value={customerSelected} onChange={handleChangeCustomers}>
                {customers.map((item, index) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.nomeFantasia}
                    </option>
                  );
                })}
              </select>
            )}
            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita técnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>
            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                checked={status === "Aberto"}
                onChange={handleOptionChange}
              />
              <span>Em Aberto</span>
              <input
                type="radio"
                name="radio"
                value="Progresso"
                checked={status === "Progresso"}
                onChange={handleOptionChange}
              />
              <span>Progresso</span>
              <input
                type="radio"
                name="radio"
                value="Atendido"
                checked={status === "Atendido"}
                onChange={handleOptionChange}
              />
              <span>Atendido</span>
            </div>
            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="descreva seu problema (opcional)"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default New;
