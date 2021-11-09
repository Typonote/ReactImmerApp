import React, { useRef, useCallback, useState } from "react";
import produce from "immer";

// produce 함수는 두 가지 파라미터를 받는다. =>  (수정하고 싶은 상태, 어떻게 업데이트 할지 정의하는 함수)
// 불변성에 신경 쓰지 않는 것 처럼 작성하되, 불변성 관리는 제대로 해 주는 것
// Immer 를 사용해서 간단해지는 업데이트가 있고, 오히려 코드가 길어지는 업데이트 들이 있다. => 전개 연산자와 배열의 내장함수를 사용하여 업데이트하는 경우도 많다.
// 컴포넌트의 상태 업데이트가 까다로울때 immer 라이브러리를 사용하면 좋다.
// immer 는 배열의 직접적인 변화를 일으키는 push, slice등의 함수를 사용해도 무방하다.

const App = () => {
  const nextId = useRef(1);
  const [form, setForm] = useState({ name: "", username: "" });
  const [data, setData] = useState({
    array: [],
    uselessValue: null,
  });

  // input 수정을 위한 함수
  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(
      produce((draft) => {
        draft[name] = value;
      })
    );
  }, []);

  // form 등록을 위한 함수
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const info = {
        id: nextId.current,
        name: form.name,
        username: form.username,
      };

      // array 에 새 항목 등록
      setData(
        produce((draft) => {
          draft.array.push(info);
        })
      );

      // form 초기화
      setForm({
        name: "",
        username: "",
      });
      nextId.current += 1;
    },
    [form.name, form.username]
  );

  // 항목을 삭제하는 함수
  const onRemove = useCallback((id) => {
    setData(
      produce((draft) => {
        draft.array.splice(
          draft.array.findIndex((info) => info.id === id),
          1
        );
      })
    );
  }, []);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="아이디"
          value={form.username}
          onChange={onChange}
        />
        <input
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={onChange}
        />
        <button type="submit">등록</button>
      </form>
      <div>
        <ul>
          {data.array.map((info) => (
            <li key={info.id} onClick={() => onRemove(info.id)}>
              {info.username} ({info.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
