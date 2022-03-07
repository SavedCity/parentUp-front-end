export function childInputValidation(
  name,
  setNameErr,
  setDobErr,
  childPhoto,
  dobRef,
  setImageErr,
  setFullNameRequiredErr,
  fieldsPassedValidation
) {
  if (childPhoto === "") {
    setImageErr(true);
    fieldsPassedValidation = true;
    console.log(fieldsPassedValidation);
  }
  if (dobRef.current.value === "") {
    setDobErr(true);
    fieldsPassedValidation = true;
    console.log(fieldsPassedValidation);
  }
  if (name.trim() === "") {
    setNameErr(true);
    fieldsPassedValidation = true;
    console.log(fieldsPassedValidation);
  }
  if (name.trim().indexOf(" ") === -1) {
    setFullNameRequiredErr(true);
    fieldsPassedValidation = true;
    console.log(fieldsPassedValidation);
  }
}
