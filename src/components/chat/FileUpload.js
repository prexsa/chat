function FileUpload() {
  return (
    <form onSubmit={handleSubmit(onFileSubmit)}>
      <input type="file" accept="image/png, image/jpeg" />

      {/*<FaPaperclip onClick={handleFileUpload} />*/}
    </form>
  );
}

export default FileUpload;
