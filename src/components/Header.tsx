// import { Link } from '@tanstack/react-router'
// import { useSession } from '../hooks/useSession'
// import { supabase } from '../supabaseClient'

// export default function Header() {
//   const { session } = useSession()

//   return (
//     <header className="p-2 flex gap-2 bg-white text-black justify-between">
//       <nav className="flex flex-row">
//         <div className="px-2 font-bold">
//           <Link to="/">Home</Link>
//         </div>

//         <div className="px-2 font-bold">
//           <Link to="/demo/table">TanStack Table</Link>
//         </div>

//         <div className="px-2 font-bold">
//           <Link to="/demo/tanstack-query">TanStack Query</Link>
//         </div>

//         {session && (
//           <button
//             className="cursor-pointer px-2 font-bold"
//             onClick={() => supabase.auth.signOut()}
//           >
//             Logout
//           </button>
//         )}
//       </nav>
//     </header>
//   )
// }
