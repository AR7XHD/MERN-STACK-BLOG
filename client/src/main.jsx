import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor ,store } from './redux/store'
createRoot(document.getElementById('root')).render(


      <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
    <ToastContainer />
    <App />
    </PersistGate>
    </Provider>

)
