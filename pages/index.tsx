import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';


const dummyTasks = [
  { id: 1, name: 'Follow Kyle on Instagram', reward: 'Tx Fee Reward of $5 on Base', slots: '2/100 slots left' },
  { id: 2, name: 'Follow Sharon on X', reward: 'Get 2 free transaction on Base', slots: '2/100 slots left' },
  { id: 3, name: 'Follow Kyle on Instagram', reward: 'Reward of 100 casts', slots: '2/100 slots left' },
];

const Home: NextPage = () => {
  return (
    <div>
    <nav className="flex items-center justify-between p-5 bg-white">
      <div className="flex items-center space-x-4">
        <img src="/logo.svg" alt="Logo" className="h-8" />
        <h1 className="text-white text-lg">My Dapp</h1>
      </div>
      <div className="flex space-x-4">
        <button className="bg-white text-blue-500 px-4 py-2 rounded">
          Create Task
        </button>
        <ConnectButton />
      </div>
    </nav>
    
    <div className="p-10">
    <div className=" p-10 text-center relative px-[10rem] rounded-3xl">
      <img src="/banner.svg" alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-50 rounded-3xl" />
      <h2 className="relative text-2xl text-blue-900 font-bold">Help others pay for tx fee</h2>
      <p className="relative text-blue-700">Want to fill a survey? Get followed on Socials? Or feel like a philanthropist? Create task and help others by paying for their transaction.</p>
      <button className="relative bg-blue-500 text-white px-4 py-2 rounded mt-4">Create a task</button>
    </div>
      <h3 className="text-xl font-semibold mt-4">Tasks</h3>
      <ul className='pt-[2rem]'>
          {dummyTasks.map((task) => (
            <li key={task.id} className="p-4 mb-4 border border-gray-200 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold">{task.name}</h4>
                <p className="text-sm text-gray-500">{task.reward}</p>
                <p className="text-sm text-gray-500">{task.slots}</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Complete Task</button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded">Verify</button>
              </div>
            </li>
          ))}
        </ul>
    </div>
  </div>
  );
};

export default Home;
