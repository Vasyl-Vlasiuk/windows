import checkNumImputs from './checkNumInputs';

const forms = (state) => {
  const form = document.querySelectorAll('form'),
        inputs = document.querySelectorAll('input');

  checkNumImputs('input[name="user_phone"]');

  const postStatus = {
    loading: 'spinner.gif',
    success: 'success.gif',
    failure: 'failure.gif'
  };

  const postData = async (url, data) => {
    document.querySelector('.status').src=`../../test/assets/img/${postStatus.loading}`;

    let res = await fetch(url, { 
      method: "POST",
      body: data
    });

    return await res.text();
  };

  form.forEach(item => {
    item.addEventListener('submit', (e) => {
      e.preventDefault();

      let statusSvg = document.createElement('img');
      statusSvg.classList.add('status');
      item.appendChild(statusSvg);

      const formData = new FormData(item);

      if (item.getAttribute('data-calc') === 'end') {
        for (let key in state) {
          formData.append(key, state[key]);
        }
      }

      postData('assets/server.php', formData)
        .then(res => {
          statusSvg.src=`../../test/assets/img/${postStatus.success}`;
        })
        .catch(() => statusSvg.src=`../../test/assets/img/${postStatus.failure}`)
        .finally(() => {
          inputs.forEach(item => item.value = '');
          setTimeout(() => statusSvg.remove(), 5000);
        });
    });
  });
};

export default forms;