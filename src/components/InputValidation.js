export function inputValidation(
  name,
  setNameErr,
  setDobErr,
  childPhoto,
  dobRef,
  setImageErr,
  setFullNameRequired,
  nameErr,
  dobErr,
  imageErr,
  fullNameRequired
) {
  //   if (childPhoto === "" && name.trim() === "" && dobRef.current.value === "") {
  //     setNameErr(true);
  //     setDobErr(true);
  //     setImageErr(true);
  //     console.log(nameErr, dobErr, imageErr, fullNameRequired);
  //   } else if (
  //     childPhoto === "" &&
  //     name.trim().indexOf(" ") === -1 &&
  //     dobRef.current.value === ""
  //   ) {
  //     setFullNameRequired(true);
  //     setDobErr(true);
  //     setImageErr(true);
  //     console.log(nameErr, dobErr, imageErr, fullNameRequired);
  //   } else if (childPhoto === "" && name.trim() === "") {
  //     setNameErr(true);
  //     setImageErr(true);
  //     console.log(nameErr, dobErr, imageErr, fullNameRequired);
  //   } else if (childPhoto === "" && dobRef.current.value === "") {
  //     setDobErr(true);
  //     setImageErr(true);
  //     console.log(nameErr, dobErr, imageErr, fullNameRequired);
  //   } else if (name.trim() === "" && dobRef.current.value === "") {
  //     setNameErr(true);
  //     setDobErr(true);
  //     console.log(nameErr, dobErr, imageErr, fullNameRequired);
  //   } else if (name.trim() === "") {
  //     setNameErr(true);
  //     console.log(nameErr, dobErr, imageErr, fullNameRequired);
  //   } else if (name.trim().indexOf(" ") === -1 && dobRef.current.value === "") {
  //     setFullNameRequired(true);
  //     setDobErr(true);
  //     console.log(nameErr, dobErr, imageErr, fullNameRequired);
  //   } else if (name.trim().indexOf(" ") === -1) {
  //     setFullNameRequired(true);
  //     console.log(nameErr, dobErr, imageErr, fullNameRequired);
  //   } else if (dobRef.current.value === "") {
  //     setDobErr(true);
  //     console.log(nameErr, dobErr, imageErr, fullNameRequired);
  //   } else if (childPhoto === "") {
  //     setImageErr(true);
  //     console.log(nameErr, dobErr, imageErr, fullNameRequired);
  //   }
  //   console.log(nameErr, dobErr, imageErr, fullNameRequired);

  if (childPhoto === "") {
    setImageErr(true);
  }
  if (dobRef.current.value === "") {
    setDobErr(true);
  }
  if (name.trim() === "") {
    setNameErr(true);
  }
  if (name.trim().indexOf(" ") === -1) {
    setFullNameRequired(true);
  }
}
