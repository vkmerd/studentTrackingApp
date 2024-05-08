const SUPABASE_URL = 'https://kyezpvmrsrnteipljzrg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5ZXpwdm1yc3JudGVpcGxqenJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNDg5OTM1MiwiZXhwIjoyMDMwNDc1MzUyfQ.1KcaEbtcnx3pH8e_wGjdCy2W6gavwvvIjd8ewWbuXvo'

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)   
const registerForm = document.querySelector("#registerForm")
console.log(_supabase);
let uniqueId = 0
const tabs = document.querySelectorAll('.tabs .button');
const contents = document.querySelectorAll('.tabs-content .content');
const registersList = document.querySelector(".registersList")
const rcollContainer = document.querySelector(".rcollContainer")

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-id');

            contents.forEach(content => {
                content.style.display = 'none';
            });

            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.style.display = 'block';
            }
        });
    });

    if (tabs.length > 0) {
        tabs[0].click();
    }

async function loadStudents(){
    const { data, error } = await _supabase.from('students').select().limit(8)
    registersList.innerHTML = '';
    data.forEach(students => registersList.innerHTML += `
    <ul class="studentinfo">
        <li>${students.student_name}</li>
        <li>${students.student_surname}</li>
        <li>${students.stemail_address}</li>
        <li>${students.student_id}</li>
        <li>${students.selectedLessonValue}</li>
    </ul>
    `
    )
}

document.addEventListener('DOMContentLoaded', loadStudents);

    async function registerConnect(e) {
        e.preventDefault(); 
    
        const formData = new FormData(this);
        const formObject = {};
    
        for (const [key, value] of formData.entries()) {
            formObject[key] = value;
        }
    
        const selectedLesson = document.querySelector('#classLesson');
        const selectedOption = selectedLesson.options[selectedLesson.selectedIndex];
        formObject['selectedLessonValue'] = selectedOption.value; 
    
        try {
            const { data, error } = await _supabase
        .from('students')
        .insert([
            {
                student_name: formObject.student_name,
                student_surname: formObject.student_surname,
                stemail_address: formObject.stemail_address,
                student_id: formObject.student_id,
                selectedLessonValue: formObject.selectedLessonValue 
            }
        ]);
    
            if (error) throw error;
            console.log('Kayıt başarılı:', data);
            registerForm.reset();
            loadStudents();
            
            
        } catch (error) {
            console.error('Kayıt hatası:', error.message);
        }
        
    }
    
registerForm.addEventListener('submit', registerConnect)

async function studentRollColl(){
    const { data, error } = await _supabase.from('students').select()
    rcollContainer.innerHTML = '';
    
    for(let i =0 ; i<data.length;i++ ){
        let rolStudent = data[i];
        uniqueId++
        rcollContainer.innerHTML += `
            <div class="rColUser" data-student-id="${uniqueId}">
                    <div class="rtitle">
                        <h3>${rolStudent.student_name}  ${rolStudent.student_surname}</h3>
                    </div>
                    <div class="rbutton">
                        <button class="comegreenButton" data-student-id="${uniqueId}">Geldi</div>
                        <button class="comeredButton" data-student-id="${uniqueId}">Gelmedi</div>
                    </div>
            </div>
    `;
    }

    const comegreenButton = document.querySelectorAll(".comegreenButton")
    comegreenButton.forEach((updateBtn,index) => {
        updateBtn.addEventListener("click",async function(){
            console.log("geldi" , Number(this.dataset.studentId ),"ve", data[index].id);
            const studentId = data[index].id;
            await _supabase
                .from('students')
                .update({ roll_call: 'Geldi' })
                .eq('id', studentId);
        })
    });

    const comeredButton = document.querySelectorAll(".comeredButton")
    comeredButton.forEach((deleteBtn,index) => {
        deleteBtn.addEventListener("click",async function(){
            console.log("gelmedi" , Number(this.dataset.studentId ),"ve", data[index].id);
            const studentId = data[index].id;
            await _supabase
                .from('students')
                .update({ roll_call: 'Geldi' })
                .eq('id', studentId);
        })
    });
}

studentRollColl();
