import { db,storage } from '../../lib/firebase'
import { updateDoc,setDoc, doc, Timestamp,collection,query,where,getDocs } from 'firebase/firestore'
import { getDownloadURL,ref } from '@firebase/storage'

export default async function handler(req, res)
{
    try
    {
        const Idref = collection(db, 'events')
        const q = query(Idref, where('name', '==', req.body.oldTitle))
        const ans = await getDocs(q)
        const id = ans.docs[0].id
        if (req.body.changeImage == 'true')
        {
            const response = await getDownloadURL(ref(storage, `events/${id}.png`))
            await setDoc(doc(db, 'events', `${id}`), { image: response }, {merge: true})
        }
        if (req.body.changeFields == 'true')
        {
            
            const response = await getDownloadURL(ref(storage, `events/${id}.png`))
            await updateDoc(doc(db, 'events', `${id}`), {
                name: req.body.name,
                description: req.body.description,
                venue: req.body.venue,
                timestamp: Timestamp.fromDate(new Date(req.body.timestamp)),
                image: response
            });   
        }
    }
    catch (e)
    {
        console.log(e);
    }
    res.status(200).send('Success');
}