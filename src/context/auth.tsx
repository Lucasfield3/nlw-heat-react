import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id:string;
    login:string;
    avatar_url:string;
    name:string;
}

type AuthContextData = {
    signInUrl:string;
    user:User | null;
    signOut:()=>void;
}

export const AuthContext = createContext({} as AuthContextData)

type AuthProviderProps = {
    children:ReactNode
}

type AuthResponse = {
    token: string;
    user:{
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
};

export const AuthProvider = (props:AuthProviderProps) => {

    const [ user, setUser ] = useState<User | null>(null)

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=ab14fb74db760e9dd8ba`

    const signIn = async (githubCode: string) => {

        const response = await api.post<AuthResponse>('/authenticate', {
            code:githubCode
        })

        const { token, user } = response.data

        localStorage.setItem('@dowhile:token', token)

        api.defaults.headers.common.authorization = `Bearer ${token}`

        setUser(user)

    }

    const signOut = ()=>{
        localStorage.removeItem('@dowhile:token')
        setUser(null)
    }

    useEffect(() => {

        const token = localStorage.getItem('@dowhile:token')

        if(token){
            api.defaults.headers.common.authorization = `Bearer ${token}`

            api.get<User>('/profile').then(response =>{
                setUser(response.data)
            })
        }

    }, [])

    useEffect(()=>{

        const url = window.location.href

        const itHasCode = url.includes('?code=')

        if(itHasCode) {
            const [ urlWithoutCode, githubCode ] = url.split('?code=')

            window.history.pushState({}, '', urlWithoutCode)

            signIn(githubCode)

        }

    }, [])


    return(
        <AuthContext.Provider value={{signInUrl, user, signOut}}>
            {props.children}
        </AuthContext.Provider>
    )

}