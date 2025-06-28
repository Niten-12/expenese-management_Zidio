//java/com/expense/backend/util/SubmissionNumberGenerator
package com.expense.backend.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class SubmissionNumberGenerator {

    public static String generate(int sequence) {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String paddedSeq = String.format("%03d", sequence); // zero-padded to 3 digits
        return "SUBM-" + datePart + "-" + paddedSeq;
    }
}
