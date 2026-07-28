import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Outlet } from 'react-router'
const MainLayout = () => {
  return (
    <div className='bg-base text-ink min-h-screen'>
      <Navbar />
      <main className='page-container min-h-[70vh]'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
var stdin_default = MainLayout
export { stdin_default as default }
