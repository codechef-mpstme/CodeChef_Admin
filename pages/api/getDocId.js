import { db } from '../../lib/firebase'
import { collection,query,where,getDocs } from 'firebase/firestore'

export default async function handler(req, res)
{
    const ref = collection(db, 'events')
    const q = query(ref, where('name', '==', req.body.name));
    const response = await getDocs(q);
    const id = response.docs[0].id;
    res.status(200).json(id)
}