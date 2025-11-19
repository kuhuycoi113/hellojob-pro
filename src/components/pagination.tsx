import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

export const PaginationComponent = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {
    if (totalPages <= 1) return null;

    const handlePrevious = () => {
        onPageChange(Math.max(currentPage - 1, 1));
    };
    const handleNext = () => {
        onPageChange(Math.min(currentPage + 1, totalPages));
    };

    const pageNumbers = [];
    // Logic to show a few pages around the current one
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }


    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious onClick={handlePrevious} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} />
                </PaginationItem>
                {startPage > 1 && (
                    <PaginationItem>
                        <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
                    </PaginationItem>
                )}
                {startPage > 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}

                {pageNumbers.map(page => (
                    <PaginationItem key={page}>
                        <PaginationLink onClick={() => onPageChange(page)} isActive={page === currentPage}>
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {endPage < totalPages - 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                {endPage < totalPages && (
                    <PaginationItem>
                        <PaginationLink onClick={() => onPageChange(totalPages)}>{totalPages}</PaginationLink>
                    </PaginationItem>
                )}
                <PaginationItem>
                    <PaginationNext onClick={handleNext} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};