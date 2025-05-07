import Chat from './components/Chat';
import Logo from './components/Logo';

export default function Home() {
  return (
    <div className='w-full px-4 sm:px-6 lg:px-8 max-w-xl mx-auto py-8'>
      <header className='p-8 flex'>
        <Logo />
      </header>
      <main className='p-8'>
        <Chat />
      </main>
    </div>
  )
}
