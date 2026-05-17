import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuth';
import { useRouter } from 'vue-router';
import { validator } from '@/composable/usevalidtor';
const {validatField, error} = validator();
const router = useRouter();
const authStore = useAuthStore();

let form = reactive({
  email: '',
  password: ''
})
let loading = ref(false);

// validation ===========================
function validationEmail(){
  return (validatField('email', form.email, 'សូមបញ្ចូលអ៊ីមែលរបស់អ្នក'));
} 
function validationPassword(){
  return (validatField('password', form.password, 'សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក'));
} 
const validationPassword = () => validatField('password', form.password, 'សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក')


function validationForm(){
  let isValide = true;
  let v_email = validationEmail();
  let v_password = validationPassword();
  if(!v_email || !v_password){
    isValide = false;
  }
  return isValide
}

async function handleLogin() {
  if(!validationForm()) return;
  try {
    loading.value = true;
    await authStore.login(form);
    router.push('/dashboard');
  } catch (error) {
  
    console.error(error)
  } finally {
    loading.value = false;
  }
}