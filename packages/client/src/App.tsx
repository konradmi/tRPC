import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { trpc } from './trpc'

import './index.scss'

const client = new QueryClient()

const AppContent = () => {
  const getMessages = trpc.useQuery(['getMessages'])
  const addMessage = trpc.useMutation('addMessage')

  const onAdd = () => {
    addMessage.mutate({
      user: 'Konrad',
      message: 'Hello Konrad',
    }, {
      onSuccess: () => {
        client.invalidateQueries(['getMessages'])
      }
    })
  }

  return (
    <>
      <div>Fun with tRPC</div>
      <div>{JSON.stringify(getMessages.data)}</div>
      <button onClick={onAdd}>Add message</button>
    </>
  )
}

const App = () => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: 'http://localhost:8080/trpc'
    })
  )

  return (
    <trpc.Provider queryClient={client} client={trpcClient}>
      <QueryClientProvider client={client}>
        <AppContent/>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
