import React, {useState, useEffect} from "react";
import{Link, useNavigate } from "react-router-dom";
import { FiPower, FiTrash2 } from "react-icons/fi"

import api from "../../services/api";
import './styles.css'

import logoImg from '../../assets/logo.svg'

export default function Profile(){
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState([]);

    const ongName = localStorage.getItem('ongName');
    const ongId = localStorage.getItem('ongId');

    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization:ongId,
            }
        }).then(response => {
            setIncidents(response.data);
        })
    }, [ongId]);

    async function handleDeleteIncident(id) {
        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId,
                }
            });

            setIncidents(incidents.filter(incident => incident.id !== id));
        } catch (error) {
            alert('Erro ao deletar caso ,tente novamente');
        }
    }

    function handleLogout() {
        localStorage.clear();

        navigate('/');
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="heroes" />
                <span>Bem vindo, {ongName}</span>

                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#E02041" />
                </button>            
            </header>

            <h1>Casos registados</h1>

            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                    <strong>CASO:</strong>
                    <p>{incident.title}</p>

                    <strong>DESCRIÇÃO:</strong>
                    <p>{incident.description}</p>

                    <strong>VALOR:</strong>
                    <p>{Intl.NumberFormat('pt-br', {style: 'currency', currency: 'AOA'}).format(incident.value)}</p>

                    <button onClick={() => handleDeleteIncident(incident.id)} type="button">
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                    </li>
                ))}
            </ul>

        </div>
    );
}