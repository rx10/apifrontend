'use client'
import ModalButton from './modal';
import './table.css';

export default function Table(props: any) {
    const arr = props.arr;
    const setArr = props.setArr;
    const keys = Object.keys(arr[0]);
    return (
        <>
            <table>
                <tbody>
                    <tr className='TopBar'>
                        {keys.map((field: any) => <th key={keys.indexOf(field)}>{field}</th>)}
                        <th key={99}>Actions</th>
                    </tr>
                    {arr.map((user: any) => {
                        return (
                            <tr key={user.id}>
                                {/*COMPLICATED SPAGHETTI CODE LOL*/}
                                {keys.map((key: any) => <td key={key}>{user[keys[keys.indexOf(key)]]}</td>)}
                                <td key={arr.indexOf(user)}><ModalButton id={arr.indexOf(user)} users={arr} setUsers={setArr} /></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}