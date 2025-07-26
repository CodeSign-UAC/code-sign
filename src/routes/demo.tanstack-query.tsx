// import { createFileRoute } from '@tanstack/react-router'
// import { useQuery } from '@tanstack/react-query'
// import { supabase } from '@/supabaseClient';

// export const Route = createFileRoute('/demo/tanstack-query')({
//   component: TanStackQueryDemo,
// })

// function TanStackQueryDemo() {
//   const { data } = useQuery({
//     queryKey: ['products'],
//     queryFn: async () => {
//       const result = await supabase.from("products").select("*");
//       return result.data;
//     },
//     initialData: [],
//   })

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl mb-4">Products list (from Supabase)</h1>
//       <ul>
//         {data?.map((product) => (
//           <li key={product.name}>{product.name}</li>
//         ))}
//       </ul>
//     </div>
//   )
// }
