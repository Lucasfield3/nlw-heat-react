import { FormEvent, useContext, useState } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { AuthContext } from '../../context/auth';
import { api } from '../../services/api';
import styles from './styles.module.scss'

export const SendMessageForm = () => {

    const { user, signOut } = useContext(AuthContext)

    const [ message, setMessage ] = useState('')

    const handleMessage = async (event:FormEvent) =>{
        event.preventDefault()
        if(!message.trim()){
            return
        }

        await api.post('/messages', {
            message
        })

    }

    return (
        <div className={styles.sendMessageFormWrapper}>
            <button onClick={signOut} className={styles.signOutButton}>
                <VscSignOut size="32"/>
            </button>

            <header className={styles.userInformation}>
                <div className={styles.userImage}>
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>
                <strong className={styles.userName}>{user?.name}</strong>
                <span className={styles.userGithub}>
                    <VscGithubInverted size="16"/>
                    {user?.login}
                </span>
            </header>

            <form onSubmit={handleMessage} className={styles.sendMessageForm}>
                <label htmlFor="message">Mensagem</label>
                <textarea 
                value={message}
                onChange={(e)=> setMessage(e.target.value)}
                name="message" 
                id="message"
                placeholder='Qual é a sua expectativa para o evento?'
                ></textarea>

                <button type='submit'>
                    Enviar sua mensegem
                </button>
            </form>
        </div>
    );
};