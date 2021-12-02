import { db,storage } from '../../lib/firebase'
import { doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { deleteObject,ref } from 'firebase/storage'

export default async function handler(req, res)
{
    try
    {
        const ref = collection(db, 'events')
        const q = query(ref, where('name', '==', req.body.name));
        const response = await getDocs(q);
        const id = response.docs[0].id;
        await deleteDoc(doc(db, 'events', `${id}`))
        await deleteObject(ref(storage, `events/${id}`))
    }
    catch (err)
    {
        console.log(err)
    }
    res.status(200).send('Success');
}