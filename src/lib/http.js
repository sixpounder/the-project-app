import axios from 'axios';
import hosts from '@/hosts';

const instance = axios.create({
  baseURL: hosts.apiHost,
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' }
});

export default instance;