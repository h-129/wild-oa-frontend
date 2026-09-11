import progress from 'nprogress'
//开启全屏loading
export const showFullLoading = () => {
    progress?.start()
}
//关闭全局loading
export const hideFullLoading = () => {
    progress?.done()
}