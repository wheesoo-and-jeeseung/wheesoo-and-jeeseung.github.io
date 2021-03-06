import { db } from "./firebase";
import { doc, setDoc, getDocs, startAfter, query, orderBy, limit, collection, Query, DocumentSnapshot, where }from "firebase/firestore";
import { currentUser } from "./user";
import {useQuery} from "react-query";

const GUESTBOOK_COLLECTION = "guestbook"
const QUIZ_COLLECTION = "quiz"

const guestBookCol = collection(db, GUESTBOOK_COLLECTION)
const quizCol = collection(db, QUIZ_COLLECTION)

export const addGuestBook = (name: string, message: string) => {
    const guestBookRef = doc(guestBookCol, currentUser)
    setDoc(guestBookRef, {
        name: name,
        message: message,
        timestamp: new Date(),
    }, {}).then((v) => {
        console.log(v)
    })
}

export const useListGuestBook = () => {
    const q = query(guestBookCol, orderBy("timestamp", "desc"))
    return useQuery(
        ["guestbooks"],
        () => getDocs(q)
    )
}

export const addQuizResult = (questionId: number, question: string, correct: boolean) => {
    const quizRef = doc(quizCol, questionId.toString(), "users", currentUser)
    setDoc(quizRef, {
        questionId: questionId,
        question: question,
        correct: correct,
        timestamp: new Date(),
    }).then(v => {
        console.log(v)
    })
}

export const useQuizParticipants = (questionId: number) => {
    const q = query(collection(db, QUIZ_COLLECTION, questionId.toString(), "users"))
    return useQuery(
        ["quizParticipants", questionId.toString()],
        () => getDocs(q).then(res => res.size)
    )
}

export const useQuizCorrects = (questionId: number) => {
    const q = query(collection(db, QUIZ_COLLECTION, questionId.toString(), "users"), where("correct", "==", true))
    return useQuery(
        ["quizCorrects", questionId.toString()],
        () => getDocs(q).then(res => res.size)
    )
}
