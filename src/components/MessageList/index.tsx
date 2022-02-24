import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import logoIcon from '../../assets/logo.svg'
import { api } from '../../services/api';
import styles from './styles.module.scss';

type Message = {
    id:string;
    text:string;
    created_at:Date;
    user:{
        name:string;
        avatar_url:string;
    }
};

const socket = io('http://localhost:4000')

const messageQueue:Message[] = []

socket.on('new_message', (message:Message) => {

    messageQueue.push(message)
})

export const MessageList = () => {
    const [ message, setMessage ] = useState<Message[]>([])

    useEffect(() => {
        setInterval(()=>{
            if(messageQueue.length > 0){
                setMessage(prevState => [
                    messageQueue[0],
                    prevState[0],
                    prevState[1]
                ].filter(Boolean))

                messageQueue.shift()
            }
        }, 3000)
    }, [])

    useEffect(()=>{

        api.get<Message[]>("/messages/last-3").then((res)=>{
            setMessage(res.data);
        })

    }, [])

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoIcon} alt="logo" />
            <ul className={styles.messageList}>
                {message.map((message)=>{
                    return (
                        <li key={message.id} className={styles.message}>
                            <p className={styles.messageContent}>
                                {message.text}
                            </p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>
                                <span>{message.user.name}</span>
                            </div> 
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};